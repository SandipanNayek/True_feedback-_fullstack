'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue} from 'usehooks-ts'

const Page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmatting, setIsSubmatting] = useState(false)

    const debouncedUsername = useDebounceValue(username, 300)


  return (
    <div>page</div>
  )
}

export default Page