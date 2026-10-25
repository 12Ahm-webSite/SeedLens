import { NextResponse } from 'next/server';
import { getAnalytics, recordVisit } from '@/lib/analytics';

const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin') || req.headers.get('x-admin-pin');

    if (pin !== ADMIN_PIN) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Admin PIN', authenticated: false },
        { status: 401 }
      );
    }

    const data = getAnalytics();
    return NextResponse.json({
      authenticated: true,
      data,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return NextResponse.json(
      { error: 'Internal server error fetching analytics' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, visitorHash, edition, pin } = body as {
      action?: string;
      visitorHash?: string;
      edition?: string;
      pin?: string;
    };

    if (action === 'verify') {
      const isValid = pin === ADMIN_PIN;
      return NextResponse.json({ valid: isValid });
    }

    if (action === 'track_visit') {
      recordVisit(visitorHash, { edition });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Analytics track error:', err);
    return NextResponse.json({ error: 'Failed to record tracking' }, { status: 500 });
  }
}
