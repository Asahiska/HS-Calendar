import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { PROGRAM_OPTIONS } from "@/components/Functions/programData";

function parseYear(value: string): number | null {
    const y = value.trim();
    if (!y) return null;
    return y.length === 2 ? 2000 + Number(y) : Number(y);
}

type SelectedCourse = {
    code: string;
    label: string;
};

function highlightMatch(text: string, query: string) {
    const q = query.trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <span className="rounded-sm bg-[#736CED] text-white">
                {text.slice(idx, idx + q.length)}
            </span>
            {text.slice(idx + q.length)}
        </>
    );
}

function CourseSelector() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [semester, setSemester] = useState("");
    const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Matches by text alone, ignoring the Year filter — used to tell "genuinely
    // no such course" apart from "exists, just not for that year" below.
    const textMatches = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return PROGRAM_OPTIONS.filter(
            (o) =>
                (o.label.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)) &&
                !selectedCourses.some((s) => s.code === o.code)
        );
    }, [query, selectedCourses]);

    const suggestions = useMemo(() => {
        const yearNum = parseYear(yearFilter);
        return textMatches
            .filter((o) => yearNum === null || o.year === yearNum)
            .slice(0, 8);
    }, [textMatches, yearFilter]);

    const addCourse = (course: SelectedCourse) => {
        setSelectedCourses((prev) =>
            prev.some((c) => c.code === course.code) ? prev : [...prev, course]
        );
        setQuery("");
        setHighlightedIndex(0);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeCourse = (code: string) => {
        setSelectedCourses((prev) => prev.filter((c) => c.code !== code));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (suggestions.length > 0) {
                setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
                setShowSuggestions(true);
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (suggestions.length > 0) {
                const chosen = suggestions[Math.min(highlightedIndex, suggestions.length - 1)];
                addCourse({ code: chosen.code, label: chosen.label });
            } else if (query.trim() && textMatches.length === 0) {
                // Only accept raw typed text as a manual code when it matches no known
                // program at all — if it exists but was excluded by the Year filter,
                // silently adding it would add the wrong year's course.
                addCourse({ code: query.trim(), label: query.trim() });
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const handleContinue = () => {
        const codes = selectedCourses.map((c) => c.code).join(",");
        const params = new URLSearchParams({
            courses: codes,
            sem: semester.trim(),
            year: yearFilter.trim(),
        });
        navigate(`/filter?${params.toString()}`);
    };

    return (
        <div className="relative flex m-0 p-0 flex-col items-center justify-center bg-page w-screen min-h-screen">
            <Card className="p-6 rounded-lg m-6 w-full lg:w-3/4 bg-transparent border-none shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-white text-xl">Select Your Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">

                        <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_42rem_1fr] md:items-start">
                            <div className="hidden md:block" />
                            <div className="relative">
                                <label className="text-sm font-medium mb-1 block text-white opacity-0 select-none" aria-hidden="true">
                                    Course
                                </label>
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Course name or code"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setHighlightedIndex(0);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                    onKeyDown={handleKeyDown}
                                    className="h-11 rounded-full border-none bg-[#ADA5F6] px-4 text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-auto rounded-xl bg-[#ADA5F6] shadow-lg">
                                        {suggestions.map((s) => (
                                            <li
                                                key={s.code}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    addCourse({ code: s.code, label: s.label });
                                                }}
                                                className="px-3 py-2 text-sm cursor-pointer hover:bg-[#ADA5F6]"
                                            >
                                                <div className="font-medium">{highlightMatch(s.label, query)}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block text-white whitespace-nowrap">
                                        Year <span className="text-red-300">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Year"
                                        required
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="h-11 w-20 rounded-full border-none bg-[#ADA5F6] text-center text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block text-white whitespace-nowrap">
                                        Semester <span className="text-red-300">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="SEM"
                                        required
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                        className="h-11 w-20 rounded-full border-none bg-[#ADA5F6] text-center text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                            </div>
                        </div>

                        {selectedCourses.length > 0 && (
                            <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_42rem_1fr] md:items-start">
                                <div className="hidden md:block" />
                                <div className="flex flex-col items-start gap-2">
                                    {selectedCourses.map((c) => (
                                        <span
                                            key={c.code}
                                            className="inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#736CED] text-white text-sm px-3 py-1"
                                        >
                                            {c.label}
                                            <button
                                                type="button"
                                                onClick={() => removeCourse(c.code)}
                                                className="ml-1 hover:text-blue-950"
                                                aria-label={`Remove ${c.label}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_42rem_1fr] md:items-start">
                            <div className="hidden md:block" />
                            <div className="hidden md:block" />
                            <div className="w-44 flex justify-end">
                                <Button
                                    onClick={handleContinue}
                                    disabled={selectedCourses.length === 0 || !semester.trim() || !yearFilter.trim()}
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CourseSelector;
