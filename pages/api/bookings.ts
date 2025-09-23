import type { NextApiRequest, NextApiResponse } from 'next';
import handler from 'api/bookings';

export default function api(req: NextApiRequest, res: NextApiResponse) {
  return (handler as any)(req, res);
}
