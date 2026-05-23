import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return res.status(200).json({
      user: null,
      message: 'Auth is handled client-side via Supabase Auth. Use POST to /auth/signin or /auth/signup instead.',
    })
  }

  res.redirect('/auth')
}
