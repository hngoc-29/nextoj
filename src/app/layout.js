import "./globals.css";
import { ToastContainer } from 'react-toastify';
import UserProvider from "@/context/user";
import LayoutWrapper from "@/components/LayoutWrapper";
import LoginForm from "@/components/LoginForm"
import LoginProvider from '@/context/modalLogin';
import UserContestProvider from "@/context/userContest";
import ProblemContestProvider from "@/context/problemContest";
import LoadingProvider from "@/context/loadingLoad";
import Loading from "@/components/Loading";

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL),
  title: 'Giải bài lập trình | OJ Platform',
  description: 'Cùng nhau luyện tập lập trình tại OJ Platform.',
  openGraph: {
    title: 'OJ Platform',
    description: 'Cùng nhau luyện tập lập trình tại OJ Platform.',
    images: ['/vnojlogo.png'],
    type: 'website',
    url: process.env.BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OJ Platform',
    description: 'Luyện tập lập trình cùng cộng đồng',
    images: ['/vnojlogo.png'],
  },
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

// Tách themeColor sang export viewport riêng
export const viewport = {
  themeColor: '#ffffff',
};


export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <meta name="google-site-verification" content="exKzkXXkfCbBRohkUy2ptqVdT9oa8jqNnGSp2cY2m-Y" />
      </head>
      <body
        className={`antialiased`}
      >
        <UserProvider>
          <LoadingProvider>
            <Loading />
            <LoginProvider>
              <LayoutWrapper>
                <LoginForm />
                <UserContestProvider>
                  <ProblemContestProvider>
                    <main>
                      <div>{children}</div>
                    </main>
                  </ProblemContestProvider>
                </UserContestProvider>
              </LayoutWrapper>
            </LoginProvider>
            <ToastContainer />
          </LoadingProvider>
        </UserProvider>
      </body>
    </html >
  );
}
