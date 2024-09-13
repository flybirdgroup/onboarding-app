import { NextRequest, NextResponse } from "next/server";

const crStatusData = [
  { EIM: '24520458723', ProjectID: 'BProject', CR: 'CR-35739583', Github: 'https://hello.com', Cyberflow: 'pass', SonartypeIQScan: 'pass', ICE: 90 },
  { EIM: '38520458729', ProjectID: 'LProject', CR: 'CR-35739582', Github: 'https://hello.com', Cyberflow: 'pass', SonartypeIQScan: 'pass', ICE: 88 },
  { EIM: '56520458753', ProjectID: 'MProject', CR: 'CR-35739581', Github: 'https://hello.com', Cyberflow: 'failed', SonartypeIQScan: 'pass', ICE: 76 },
  { EIM: '24566458721', ProjectID: 'MVProject', CR: 'CR-35739580', Github: 'https://hello.com', Cyberflow: 'failed', SonartypeIQScan: 'pass', ICE: 70 },
  { EIM: '94520458456', ProjectID: 'GProject', CR: 'CR-35739579', Github: 'https://hello.com', Cyberflow: 'failed', SonartypeIQScan: 'pass', ICE: 75 },
];

export async function GET() {
  // In a real application, you would fetch this data from a database or external API
  return NextResponse.json(crStatusData);
}
