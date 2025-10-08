"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Clock, CheckCircle2, Trash2 } from "lucide-react";

interface PracticeTest {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  _count: {
    questions: number;
    attempts: number;
  };
  attempts: Array<{
    score: number;
    completedAt: string;
  }>;
}

export default function PracticePage() {
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/practice");
      const data = await response.json();
      setTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testId: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    try {
      await fetch(`/api/practice/${testId}`, {
        method: "DELETE",
      });
      setTests(tests.filter((t) => t.id !== testId));
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading practice tests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice Tests</h1>
          <p className="text-muted-foreground mt-1">
            Test your knowledge with AI-generated practice tests
          </p>
        </div>
        <Button asChild>
          <Link href="/practice/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Test
          </Link>
        </Button>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No practice tests yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first AI-generated practice test
            </p>
            <Button asChild>
              <Link href="/practice/new">Create Practice Test</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => {
            const lastAttempt = test.attempts[0];
            const bestScore = test.attempts.length > 0
              ? Math.max(...test.attempts.map((a) => a.score))
              : null;

            return (
              <Card key={test.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      {test.description && (
                        <CardDescription className="mt-1">
                          {test.description}
                        </CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(test.id)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {test._count.questions} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {test._count.attempts} attempts
                    </span>
                  </div>

                  {bestScore !== null && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Best Score: {bestScore.toFixed(0)}%</span>
                    </div>
                  )}

                  {lastAttempt && (
                    <div className="text-xs text-muted-foreground">
                      Last attempt: {new Date(lastAttempt.completedAt).toLocaleDateString()}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button asChild className="flex-1">
                      <Link href={`/practice/${test.id}`}>
                        {test._count.attempts > 0 ? "Retake Test" : "Start Test"}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/practice/${test.id}/results`}>
                        Results
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
