
import { useState } from "react";
import { 
  Target, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  BookOpen,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users,
  Star,
  Award,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PerformanceOverview() {
  const [showOverdueCheckIn, setShowOverdueCheckIn] = useState(true);
  
  const performanceData = [
    { year: "2023", score: 82 },
    { year: "2024", score: 95 },
  ];
  
  const growthRecommendations = [
    {
      title: "Leadership Excellence Program",
      type: "Course",
      duration: "6 weeks",
      match: "92%",
      icon: <Award className="w-5 h-5" />
    },
    {
      title: "Sarah Johnson - Senior Manager",
      type: "Mentor",
      experience: "8 years",
      match: "88%",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Data Analytics Certification",
      type: "Certification",
      duration: "3 months",
      match: "85%",
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overdue Check-in Banner */}
      {showOverdueCheckIn && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 animate-fade-in">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">Time for a quick sync?</h3>
                <p className="text-sm text-amber-700">Your monthly check-in is overdue by 3 days</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowOverdueCheckIn(false)}
                className="border-amber-300 hover:bg-amber-100"
              >
                Dismiss
              </Button>
              <Button 
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Schedule Check-In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Goals & OKRs */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Smart Goals & OKRs</CardTitle>
              <CardDescription>AI-powered goal setting and tracking</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100">
              <h4 className="font-semibold text-teal-900 mb-2">Q4 2024 Goals</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-700">Increase team productivity</span>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">85%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-700">Complete leadership training</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">100%</Badge>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200">
              <Button className="w-full h-24 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-none">
                <div className="text-center">
                  <Target className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-semibold">Create New Goal</span>
                </div>
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800">
              <strong>AI Suggestion:</strong> Based on your role, consider adding "Mentor 2 junior developers" as a Q1 goal
            </span>
          </div>
        </CardContent>
      </Card>

      {/* AI-Driven 360° Feedback */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">360° Feedback Hub</CardTitle>
              <CardDescription>Comprehensive feedback with AI insights</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-900 mb-1">Strengths</h4>
              <p className="text-sm text-purple-700">Leadership, Communication</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-semibold text-amber-900 mb-1">Growth Areas</h4>
              <p className="text-sm text-amber-700">Time Management</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-900 mb-1">Bias Check</h4>
              <p className="text-sm text-green-700">Tone: Positive</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Request Feedback
            </Button>
            <Button variant="outline">
              <AlertCircle className="w-4 h-4 mr-2" />
              View Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Performance Trends</CardTitle>
                <CardDescription>Year-over-year comparison</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Toggle Comparison
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center justify-center mb-4">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-600 font-medium">Performance Chart</p>
              <p className="text-sm text-blue-500">Interactive visualization would go here</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">+15%</p>
                  <p className="text-sm text-green-700">vs. last year</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">4.8/5</p>
                  <p className="text-sm text-blue-700">Current rating</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Recommendations */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Growth Recommendations</CardTitle>
              <CardDescription>Personalized learning & development</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {growthRecommendations.map((item, index) => (
              <div key={index} className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.duration || item.experience}</span>
                        <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                          {item.match} match
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500 transition-all duration-300">
                    Add to Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-5 h-5 text-teal-600" />
              <div>
                <p className="font-semibold text-teal-900">AI Tip</p>
                <p className="text-sm text-teal-700">These recommendations are based on your last review and career goals</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
