import { Logo } from './Logo';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Logo />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">© {new Date().getFullYear()} BuildMyCV. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
