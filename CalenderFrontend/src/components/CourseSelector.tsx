import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { PROGRAM_OPTIONS } from "@/components/Functions/programData";
import { useToast } from "@/hooks/use-toast";

function parseYear(value: string): number | null {
    const y = value.trim();
    if (!y) return null;
    return y.length === 2 ? 2000 + Number(y) : Number(y);
}

type SelectedCourse = {
    code: string;
    label: string;
};

function queryWords(query: string): string[] {
    return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

// Every typed word just needs to appear somewhere in the text — not as one
// contiguous phrase. Without this, an English query like "information
// management" would never match a German compound label like
// "Informationsmanagement" (one word, no space).
function matchesAllWords(text: string, words: string[]): boolean {
    const lower = text.toLowerCase();
    return words.every((w) => lower.includes(w));
}

function highlightMatch(text: string, query: string) {
    const words = queryWords(query);
    if (words.length === 0) return text;

    const lower = text.toLowerCase();
    const ranges: [number, number][] = [];
    for (const w of words) {
        let from = 0;
        let idx;
        while ((idx = lower.indexOf(w, from)) !== -1) {
            ranges.push([idx, idx + w.length]);
            from = idx + w.length;
        }
    }
    if (ranges.length === 0) return text;

    ranges.sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    for (const range of ranges) {
        const last = merged[merged.length - 1];
        if (last && range[0] <= last[1]) {
            last[1] = Math.max(last[1], range[1]);
        } else {
            merged.push(range);
        }
    }

    const nodes: ReactNode[] = [];
    let cursor = 0;
    merged.forEach(([start, end], i) => {
        if (start > cursor) nodes.push(text.slice(cursor, start));
        nodes.push(
            <span key={i} className="rounded-sm bg-[#736CED] text-white">
                {text.slice(start, end)}
            </span>
        );
        cursor = end;
    });
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return <>{nodes}</>;
}

function CourseSelector() {
    const navigate = useNavigate();
    const { toast } = useToast();

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
        const words = queryWords(query);
        if (words.length === 0) return [];
        return PROGRAM_OPTIONS.filter(
            (o) =>
                matchesAllWords(`${o.label} ${o.code}`, words) &&
                !selectedCourses.some((s) => s.code === o.code)
        );
    }, [query, selectedCourses]);

    const suggestions = useMemo(() => {
        const yearNum = parseYear(yearFilter);
        return textMatches
            .filter((o) => yearNum === null || o.year === yearNum)
            .slice(0, 8);
    }, [textMatches, yearFilter]);

    // Course codes only exist for specific years — forcing an arbitrary year
    // onto a selected course's code can produce a combination that was never
    // a real schedule. So instead of overriding the year at link time, keep
    // the selection itself always valid: whenever Year changes, drop any
    // already-selected course that no longer matches it.
    useEffect(() => {
        const yearNum = parseYear(yearFilter);
        if (yearNum === null) return;
        setSelectedCourses((prev) => {
            const mismatched = prev.filter((c) => {
                const opt = PROGRAM_OPTIONS.find((o) => o.code === c.code);
                return opt && opt.year !== yearNum;
            });
            if (mismatched.length === 0) return prev;
            toast({
                variant: "destructive",
                title: "Removed course(s) for a different year",
                description: mismatched.map((c) => c.label).join(", "),
            });
            return prev.filter((c) => !mismatched.includes(c));
        });
    }, [yearFilter]);

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
            } else if (query.trim() && textMatches.length > 0) {
                // It exists, just not for the currently selected Year — adding it
                // anyway would silently produce the wrong year's course.
                toast({
                    variant: "destructive",
                    title: "Not offered in that year",
                    description: `"${query.trim()}" exists, but not for the year you've set. Try a different year or clear the year field.`,
                });
            } else if (query.trim()) {
                toast({
                    variant: "destructive",
                    title: "No matching course",
                    description: `"${query.trim()}" doesn't match any known course. Check the spelling or try a different search term.`,
                });
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const handleContinue = () => {
        const codes = selectedCourses.map((c) => c.code).join(",");
        const params = new URLSearchParams({ courses: codes, sem: semester.trim() });
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
