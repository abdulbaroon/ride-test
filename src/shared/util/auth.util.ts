"use client"
import { deleteCookie } from "cookies-next"

export const deleteCookies = () => {
    deleteCookie("token")
    deleteCookie("user")
}