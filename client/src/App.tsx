import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/home";
import Wardrobe from "@/pages/wardrobe";
import Calendar from "@/pages/calendar";
import Recommendations from "@/pages/recommendations";
import Settings from "@/pages/settings";
import History from "@/pages/history";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/wardrobe" component={Wardrobe} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/settings" component={Settings} />
        <Route path="/history" component={History} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;