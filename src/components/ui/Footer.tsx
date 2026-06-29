import { motion } from "framer-motion";
import { fadeInUp, transitions } from "@/lib/animations";
import {
  FaSquareEnvelope,
  FaLinkedin,
  FaSquareGithub,
  FaGlobe,
} from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-card w-full mx-auto border-t border-border px-4 py-3 flex items-center justify-between shadow-lg">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={transitions.snappy}
        className="container mx-auto flex flex-col gap-2 items-center text-muted"
      >
        <div className="text-primary text-sm">
          &copy; {new Date().getFullYear()} Designed and Built by{" "}
          <a
            href="https://farhan-abir.vercel.app"
            className="font-medium hover:underline transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Farhan Noor Abir
          </a>
        </div>
        <div className="flex gap-1 text-3xl justify-center lg:justify-end items-center">
          <a
            href="mailto:fnoor.abir@gmail.com"
            className="text-primary/80 hover:text-primary transition-colors duration-200"
          >
            <FaSquareEnvelope />
          </a>
          <a
            href="https://www.linkedin.com/in/farhannoor-abir/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/80 hover:text-primary transition-colors duration-200"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/fnabir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/80 hover:text-primary transition-colors duration-200"
          >
            <FaSquareGithub />
          </a>
          <a
            href="https://farhan-abir.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary/80 hover:bg-primary transition-colors duration-200 rounded p-1"
          >
            <FaGlobe className="text-background size-5" />
          </a>
        </div>
      </motion.div>
    </footer>
  );
}
