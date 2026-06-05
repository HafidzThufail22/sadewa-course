import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

const socialLinks = [
  {
    icon: <FaWhatsapp className="text-lg" />,
    href: "https://wa.me/628xxxxxxxxx",
    label: "WhatsApp",
  },
  {
    icon: <FaInstagram className="text-lg" />,
    href: "https://instagram.com/lpksadewa",
    label: "Instagram",
  },
  {
    icon: <FaFacebookF className="text-lg" />,
    href: "https://facebook.com/lpksadewa",
    label: "Facebook",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="w-10 h-10 rounded-full border border-primary/40 text-primary flex items-center justify-center transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary hover:scale-110"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Garis Horizontal */}
        <div className="w-full border-t border-white/20" />

        {/* Copyright */}
        <p className="text-gray-500 text-sm text-center">
          © {year} LPK Sadewa. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
