import { NextResponse } from 'next/server';

export function GET() {
  const content = `
User-agent: *
Disallow: /500
Disallow: /admin
Disallow: /api
Disallow: /problems/*/my-submissions
Disallow: /problems/*/manager-testcase
  `.trim();

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}