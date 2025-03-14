import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppHeader = () => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="w-10 h-10 text-red-500" />
            <h1 className="ml-3 text-3xl font-bold text-gray-900">MedPort</h1>
          </div>
          <Button variant="outline" className="text-lg">
            Emergency Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
