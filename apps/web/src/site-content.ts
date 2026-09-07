/**
 * Every string the portal's own pages and chrome show to a person. Features
 * keep their own content file (see `features/auth/auth-content.ts`); this holds
 * what belongs to the site itself, so the components hold no copy of their own.
 */
export const siteContent = {
  brand: "stay",
  home: {
    title: "stay",
    tagline:
      "Find and book homestays. This page is rendered on the server so it can be indexed; the booking flow and your account are not.",
    apiStatus: {
      heading: "API status",
      reachable: (checkedAt: string) => `Reachable, checked at ${checkedAt}.`,
      unreachable: "Unreachable.",
    },
  },
  account: {
    title: "Your account",
    signedInAs: (email: string) => `Signed in as ${email}.`,
  },
  notFound: {
    title: "Page not found",
    description: "That page does not exist, or it has moved.",
    backHome: "Back to home",
  },
  footer: {
    copyright: (year: number) => `© ${year} stay`,
  },
} as const;
