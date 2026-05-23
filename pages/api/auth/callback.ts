import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (!code) {
    return res.redirect('/auth?error=no_code')
  }

  // Supabase handles the code exchange client-side via onAuthStateChange
  // This endpoint just redirects back to the app
  res.redirect(`/auth?code=${code}`)
}
