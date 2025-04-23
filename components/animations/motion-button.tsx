"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@radix-ui/react-button"
import { forwardRef } from "react"

export const MotionButton = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
      <Button ref={ref} {...props}>
        {children}
      </Button>
    </motion.div>
  )
})
MotionButton.displayName = "MotionButton"
