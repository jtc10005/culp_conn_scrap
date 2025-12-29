import { NextResponse } from 'next/server';
import { getLoginMethodsConfig } from '@/lib/featureFlags';

export async function GET() {
  try {
    const loginMethods = await getLoginMethodsConfig();
    return NextResponse.json(loginMethods);
  } catch (error) {
    console.error('Error fetching login methods:', error);
    return NextResponse.json(
      { facebook: false, X: false, google: false, apple: false },
      { status: 500 }
    );
  }
}
