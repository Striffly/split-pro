'use server';

export type PublicEnvType = {
  NEXT_PUBLIC_AUTH_PROVIDERS: string;
  NEXT_PUBLIC_ENABLE_SENDING_INVITES: boolean;
  NEXT_PUBLIC_FEEDBACK_EMAIL: string | undefined;
};

export const getPublicEnv = async () => ({
  NEXT_PUBLIC_AUTH_PROVIDERS: process.env.NEXT_PUBLIC_AUTH_PROVIDERS ?? 'EMAIL',
  NEXT_PUBLIC_ENABLE_SENDING_INVITES: process.env.NEXT_PUBLIC_ENABLE_SENDING_INVITES === 'true',
  NEXT_PUBLIC_FEEDBACK_EMAIL: process.env.NEXT_PUBLIC_FEEDBACK_EMAIL ?? undefined,
});
