"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Terms(){
    const [showExtraTerms, setShowExtraTerms] = useState(false)
    return (
        <div className="text-xs mt-4 mv-10 text-gray-600 max-w-72">
            <div className="mv-5">
                <span>
                    Esta página está protegida por reCAPTCHA para verificar que no eres un robot.
                </span>
                <Button 
                variant="ghost"
                onClick={() => setShowExtraTerms(!showExtraTerms)}
                className="opacity-1 text-[#0071eb] hover:bg-transparent p-0 ml-1 h-fit"
                >
                    Más información
                </Button>
            </div>
            
            <div className="h-28">
                {showExtraTerms && <p>
                    Las Condiciones del Servicio de Google y la Política de Privacidad se aplican.
                </p>}
            </div>
        </div>
    );
}