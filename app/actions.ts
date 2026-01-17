'use server'
 
import { cookies } from 'next/headers'
 
export async function createSession(token: string) {
  const cookieStore = await cookies(); // In NextJS 15 cookies() is async
  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })
}
 
export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('authToken')
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}
