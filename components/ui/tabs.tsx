"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{ value: string; onValueChange: (v: string) => void }>({ value: "", onValueChange: () => {} })

export const Tabs = ({ value, onValueChange, children, className }: any) => {
  return <TabsContext.Provider value={{ value, onValueChange }}><div className={className}>{children}</div></TabsContext.Provider>
}

export const TabsList = ({ className, children }: any) => <div className={cn("inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>{children}</div>

export const TabsTrigger = ({ value, className, children }: any) => {
    const { value: currentValue, onValueChange } = React.useContext(TabsContext)
    const isActive = currentValue === value
    return (
        <button 
           type="button"
           className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", 
           isActive ? "bg-background text-foreground shadow" : "hover:bg-background/50 hover:text-foreground", className)}
           onClick={() => onValueChange(value)}
        >
            {children}
        </button>
    )
}

export const TabsContent = ({ value, children }: any) => {
    const { value: currentValue } = React.useContext(TabsContext)
    if (value !== currentValue) return null;
    return <div>{children}</div>
}
