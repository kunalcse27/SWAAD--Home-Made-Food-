import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children, hideFooter = false }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
