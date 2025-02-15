import { Link, useLocation } from "wouter";
import { Shirt, Settings, History, Home } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/wardrobe", icon: Shirt, label: "Wardrobe" },
    { href: "/history", icon: History, label: "History" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <nav className="hidden md:flex w-64 border-r bg-card p-4 flex-col">
          <div className="text-2xl font-bold mb-8">Wardrobe AI</div>
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background p-2">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`p-2 rounded-lg cursor-pointer ${
                    location === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;