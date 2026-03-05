import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    if (!pin || typeof pin !== 'string' || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be exactly 4 digits.' },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(pin, SALT_ROUNDS);

    return NextResponse.json({ hash });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
