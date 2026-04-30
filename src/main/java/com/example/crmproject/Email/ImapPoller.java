package com.example.crmproject.Email;

import jakarta.mail.Address;
import jakarta.mail.Flags;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.Multipart;
import jakarta.mail.Part;
import jakarta.mail.Session;
import jakarta.mail.Store;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.search.FlagTerm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Properties;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
@ConditionalOnProperty(name = "mail.enabled", havingValue = "true")
public class ImapPoller {

    private static final Logger log = LoggerFactory.getLogger(ImapPoller.class);

    private final EmailService emailService;

    @Value("${mail.host}")
    private String host;

    @Value("${mail.port:993}")
    private int port;

    @Value("${mail.user}")
    private String user;

    @Value("${mail.password}")
    private String password;

    @Value("${mail.folder:INBOX}")
    private String folderName;

    private final AtomicBoolean polling = new AtomicBoolean(false);

    public ImapPoller(EmailService emailService) {
        this.emailService = emailService;
    }

    @Scheduled(fixedDelayString = "${mail.poll-interval-ms:60000}", initialDelay = 5000)
    public void poll() {
        if (!polling.compareAndSet(false, true)) {
            log.debug("Forrige polling-runde ikke ferdig — hopper over");
            return;
        }
        try {
            pollOnce();
        } catch (Exception e) {
            log.error("IMAP-polling feilet: {}", e.getMessage());
        } finally {
            polling.set(false);
        }
    }

    private void pollOnce() throws Exception {
        Properties props = new Properties();
        props.put("mail.store.protocol", "imaps");
        props.put("mail.imaps.host", host);
        props.put("mail.imaps.port", String.valueOf(port));
        props.put("mail.imaps.ssl.enable", "true");
        props.put("mail.imaps.starttls.enable", "true");
        props.put("mail.imaps.connectiontimeout", "10000");
        props.put("mail.imaps.timeout", "30000");

        Session session = Session.getInstance(props);
        try (Store store = session.getStore("imaps")) {
            store.connect(host, port, user, password);
            try (Folder folder = store.getFolder(folderName)) {
                folder.open(Folder.READ_WRITE);

                Message[] unread = folder.search(new FlagTerm(new Flags(Flags.Flag.SEEN), false));
                if (unread.length == 0) {
                    log.debug("Ingen uleste meldinger i {}", folderName);
                    return;
                }
                log.info("Behandler {} uleste mail i {}", unread.length, folderName);

                for (Message msg : unread) {
                    try {
                        importMessage(msg);
                        msg.setFlag(Flags.Flag.SEEN, true);
                    } catch (Exception e) {
                        log.error("Klarte ikke å importere mail '{}': {}",
                                safe(msg.getSubject()), e.getMessage());
                    }
                }
            }
        }
    }

    private void importMessage(Message msg) throws Exception {
        Address[] from = msg.getFrom();
        if (from == null || from.length == 0 || !(from[0] instanceof InternetAddress addr)) {
            log.warn("Mail uten from-adresse — hopper over");
            return;
        }

        String fromEmail = addr.getAddress();
        String fromName = addr.getPersonal();
        String subject = safe(msg.getSubject());
        String body = extractText(msg);

        emailService.processIncoming(new IncomingEmailRequest(fromEmail, fromName, subject, body));
        log.info("Importerte mail fra {} (\"{}\")", fromEmail, subject);
    }

    private static String safe(String s) {
        return s == null || s.isBlank() ? "(uten emne)" : s;
    }

    private static String extractText(Part part) throws Exception {
        if (part.isMimeType("text/plain")) {
            Object content = part.getContent();
            return content != null ? content.toString() : "";
        }
        if (part.isMimeType("multipart/*")) {
            Multipart mp = (Multipart) part.getContent();
            String htmlFallback = null;
            for (int i = 0; i < mp.getCount(); i++) {
                Part bodyPart = mp.getBodyPart(i);
                if (bodyPart.isMimeType("text/plain")) {
                    return bodyPart.getContent().toString();
                }
                if (bodyPart.isMimeType("text/html") && htmlFallback == null) {
                    htmlFallback = stripHtml(bodyPart.getContent().toString());
                }
                if (bodyPart.isMimeType("multipart/*")) {
                    String nested = extractText(bodyPart);
                    if (nested != null && !nested.isBlank()) return nested;
                }
            }
            return htmlFallback != null ? htmlFallback : "";
        }
        if (part.isMimeType("text/html")) {
            return stripHtml(part.getContent().toString());
        }
        return "";
    }

    private static String stripHtml(String html) {
        if (html == null) return "";
        return html
                .replaceAll("(?i)<style[^>]*>.*?</style>", "")
                .replaceAll("(?i)<script[^>]*>.*?</script>", "")
                .replaceAll("<[^>]+>", "")
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("\\s+\n", "\n")
                .trim();
    }

}
