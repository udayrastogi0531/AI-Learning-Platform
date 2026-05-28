import React from 'react';
import {
  Brain,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Resume', href: '/dashboard/resume' },
      { name: 'Cover Letter', href: '/dashboard/cover-letter' },
      { name: 'Blog', href: '/blog' },
      { name: 'Resources', href: '/resources' },
    ],
    legal: [
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  ];
    <footer className="bg-background text-foreground border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-primary-500 mr-3" />
              <span className="text-xl font-semibold">AI Learning OS</span>
            </div>
            <p className="text-foreground-secondary mb-4 leading-relaxed">
              NeuroLearn powers resume intelligence, job matching, and interview prep in one premium workflow.
            </p>
            <a
              href="mailto:udayrastogi2004@gmail.com"
              className="inline-flex items-center text-sm text-foreground-secondary hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              udayrastogi2004@gmail.com
            </a>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Social</h4>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-foreground-secondary hover:text-foreground hover:bg-white/10 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-sm text-foreground-secondary flex flex-col md:flex-row justify-between gap-3">
          <span>© {currentYear} NeuroLearn. All rights reserved.</span>
          <span>AI Learning OS • Premium Career SaaS</span>
        </div>
      </div>
    </footer>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for learners worldwide
              </span>
              <div className="flex items-center space-x-4">
                <a href="/status" className="hover:text-primary-400 transition-colors duration-200">
                  System Status
                </a>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
