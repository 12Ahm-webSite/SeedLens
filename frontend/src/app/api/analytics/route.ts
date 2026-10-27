import { NextResponse } from 'next/server';
import { getAnalytics, recordVisit, resetAnalytics } from '@/lib/analytics';
import { verifyAdminPin, setAdminPin, normalizePin } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin') || req.headers.get('x-admin-pin');

    if (!verifyAdminPin(pin)) {
      await new Promise((resolve) => setTimeout(resolve, 600));
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
    const { action, visitorHash, edition, pin, currentPin, newPin } = body as {
      action?: string;
      visitorHash?: string;
      edition?: string;
      pin?: string;
      currentPin?: string;
      newPin?: string;
    };

    if (action === 'verify') {
      const isValid = verifyAdminPin(pin);
      if (!isValid) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      return NextResponse.json({ valid: isValid });
    }

    if (action === 'track_visit') {
      recordVisit(visitorHash, { edition });
      return NextResponse.json({ success: true });
    }

    if (action === 'change_pin') {
      const pinToCheck = currentPin || pin;
      if (!verifyAdminPin(pinToCheck)) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return NextResponse.json(
          { error: 'رمز المرور الحالي غير صحيح (Current PIN is incorrect)' },
          { status: 401 }
        );
      }

      const normalizedNew = normalizePin(newPin);
      if (!normalizedNew || normalizedNew.length < 4) {
        return NextResponse.json(
          { error: 'يجب أن يتكون رمز المرور الجديد من 4 خانات على الأقل (Minimum 4 digits)' },
          { status: 400 }
        );
      }

      const saved = setAdminPin(normalizedNew);
      if (!saved) {
        return NextResponse.json(
          { error: 'فشل حفظ رمز المرور الجديد في النظام' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'تم تحديث رمز المرور الإداري بنجاح',
      });
    }

    if (action === 'reset') {
      if (!verifyAdminPin(pin)) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return NextResponse.json({ error: 'Unauthorized PIN for reset' }, { status: 401 });
      }
      const freshData = resetAnalytics();
      return NextResponse.json({ success: true, data: freshData });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Analytics track error:', err);
    return NextResponse.json({ error: 'Failed to record tracking' }, { status: 500 });
  }
}
