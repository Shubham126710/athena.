import React from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

const SocialCloud = ({ className }) => (
  <div className={`flex gap-6 ${className}`}>
    <a href="https://github.com/Shubham126710" target="_blank" rel="noreferrer" className="hover:text-white transition-colors hover:scale-110 transform">
      <Github size={24} />
    </a>
    <a href="https://twitter.com/iamshubham_15" target="_blank" rel="noreferrer" className="hover:text-white transition-colors hover:scale-110 transform">
      <Twitter size={24} />
    </a>
    <a href="https://www.linkedin.com/in/shubham-upadhyay-a12a9428b/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors hover:scale-110 transform">
      <Linkedin size={24} />
    </a>
    <a href="https://www.instagram.com/iamshubham_15" target="_blank" rel="noreferrer" className="hover:text-white transition-colors hover:scale-110 transform">
      <Instagram size={24} />
    </a>
  </div>
);

const SolaceUILogo = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 text-white ${className}`}>
        <img src="/logo.png" alt="Athena Logo" className="w-8 h-8 rounded-sm" />
        <span className="font-serif font-bold tracking-tight text-2xl">athena.</span>
    </div>
  );
};

export default function Footer1() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <footer className="w-full py-12 bg-neutral-950 text-neutral-400 overflow-hidden relative">
      {/* Glow effect matching the premium dark theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neutral-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        variants={containerVariants}
        className="container mx-auto px-4 flex flex-col items-center gap-10 mb-12 relative z-10"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <SolaceUILogo className="h-10 w-auto" />
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-base font-medium relative z-10"
        >
          {["About", "Features", "Hub", "Notes", "Syllabus", "Contact"].map(
            (item) => (
              <motion.a
                key={item}
                href={item === 'Hub' || item === 'Notes' || item === 'Syllabus' ? `/${item.toLowerCase()}` : `#${item.toLowerCase()}`}
                className="relative px-2 py-1 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  {item}
                </span>
                <motion.span
                  className="absolute inset-0 bg-neutral-800 rounded-md -z-0 origin-center"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </motion.a>
            ),
          )}
        </motion.nav>

        {/* Social Media Icons */}
        <motion.div variants={itemVariants}>
          <SocialCloud className="text-neutral-400" />
        </motion.div>
      </motion.div>

      {/* Divider */}
      <motion.div
        className="w-full h-12 border-y border-neutral-800 opacity-20 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] relative z-10"
        style={{ backgroundSize: "10px 10px" }}
        initial={{ backgroundPositionX: "0%" }}
        whileInView={{ backgroundPositionX: "100%" }}
        viewport={{ once: true }}
        transition={{
          ease: "linear",
          duration: 20,
        }}
      />

      {/* Copyright */}
      <motion.div
        className="container mx-auto px-4 mt-8 text-center text-sm text-neutral-500 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <p>&copy; {new Date().getFullYear()} Athena. All rights reserved.</p>
        <p className="mt-1">Designed & Built by Shubham Upadhyay</p>
      </motion.div>
    </footer>
  );
}
