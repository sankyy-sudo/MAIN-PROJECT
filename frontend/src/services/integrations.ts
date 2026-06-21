const appendScript = (id: string, src: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

export const initThirdPartyIntegrations = () => {
  const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  const gtmId = import.meta.env.VITE_GTM_CONTAINER_ID;
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;

  if (ga4Id) {
    appendScript("ga4-script", `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`);
    (window as any).dataLayer = (window as any).dataLayer || [];
    const gtag = (...args: unknown[]) => (window as any).dataLayer.push(args);
    gtag("js", new Date());
    gtag("config", ga4Id);
  }

  if (gtmId) {
    appendScript("gtm-script", `https://www.googletagmanager.com/gtm.js?id=${gtmId}`);
  }

  if (metaPixelId && !(window as any).fbq) {
    const fbq = (...args: unknown[]) => {
      ((window as any).fbq.queue = (window as any).fbq.queue || []).push(args);
    };
    (window as any).fbq = fbq;
    appendScript("meta-pixel-script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", metaPixelId);
    fbq("track", "PageView");
  }
};

export const getWhatsAppUrl = () => {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER;
  return phone ? `https://wa.me/${String(phone).replace(/[^0-9]/g, "")}` : null;
};
