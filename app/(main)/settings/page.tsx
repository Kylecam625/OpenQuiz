"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Settings as SettingsIcon, Save } from "lucide-react";
import { useTheme } from "@/lib/hooks/use-theme";
import { themes } from "@/lib/config/themes";

interface UserSettings {
  id: string;
  cardsPerSession: number;
  defaultStudyMode: string;
  enableNotifications: boolean;
  theme: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme: currentTheme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (themeName: string) => {
    setSettings({ ...settings!, theme: themeName });
    // Use theme context to apply theme immediately
    setTheme(themeName as any);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p>Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and study preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="study" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Study Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={session?.user?.name || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Name management coming soon
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Account Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Type</p>
                    <p className="font-medium">Free</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Preferences Tab */}
        <TabsContent value="study" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Settings</CardTitle>
              <CardDescription>
                Customize your study experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cardsPerSession">Cards per Session</Label>
                <Input
                  id="cardsPerSession"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.cardsPerSession}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cardsPerSession: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Number of cards to review in each study session (1-100)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultStudyMode">Default Study Mode</Label>
                <select
                  id="defaultStudyMode"
                  value={settings.defaultStudyMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultStudyMode: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="flip">Flip Cards</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="typing">Type Answer</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Your preferred method for studying flashcards
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive reminders for due cards
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={settings.enableNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          enableNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the app looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.name}
                      onClick={() => handleThemeChange(themeOption.name)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        currentTheme === themeOption.name
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {themeOption.icon}
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold">{themeOption.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {themeOption.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
