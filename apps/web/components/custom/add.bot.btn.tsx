import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function AddBotBtn() {
  return (
    <Link href={"/invite"}>
      <Button variant={"secondary"}>
        Add community
      </Button>
    </Link>
  )
}
