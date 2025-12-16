import { motion } from "framer-motion";

type TitleHeaderProps = {
    titleWord1: string,
    titleWord2: string,
    desc: string
}

export default function TitleHeader({titleWord1, titleWord2, desc}:TitleHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full border-b py-7 px-4 bg-linear-to-tr from-background to-primary/5"
    >
      <h2 className="text-4xl text-center font-bold sm:text-6xl lg:text-8xl">
        {titleWord1} <span className="text-primary">{titleWord2}</span>
      </h2>

      {/* Subtle accent divider */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <p className="text-center mt-4 text-muted-foreground">
        {desc}
      </p>
    </motion.section>
  );
}
