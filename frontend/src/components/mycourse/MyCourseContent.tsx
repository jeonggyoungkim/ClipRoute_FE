import CourseCard from "./CourseCard";

export interface Course {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    locationCount: number;
    region: string;
    duration: string;
    thumbnailUrl: string;
    status: "current" | "completed";
}

interface MyCourseContentProps {
    groupedCourses: [string, Course[]][];
    isEmptyCurrentCourses: boolean;
    onNavigateToCourse: (courseId: number) => void;
}

export default function MyCourseContent({
    groupedCourses,
    isEmptyCurrentCourses,
    onNavigateToCourse,
}: MyCourseContentProps) {
    return (
        <main className="flex-1 px-5">
            {isEmptyCurrentCourses ? (
                <div className="flex flex-col items-center justify-center pt-24 px-6 text-center">
                    <h1 className="text-black font-bold mb-1 text-[16px]">
                        아직 저장한 코스가 없어요
                    </h1>
                    <p className="text-black text-sm font-semi-bold mb-8 leading-relaxed">
                        영상 코스를 둘러보고 여행을 계획해 보세요
                    </p>
                    <button className="bg-[#42BCEB] text-white px-10 py-3 rounded-xl font-bold shadow-m shadow-blue-100 active:scale-95 transition-transform">
                        코스 둘러보기
                    </button>
                </div>
            ) : (
                <div className="mt-2 space-y-6">
                    {groupedCourses.map(([month, courses]) => (
                        <div key={month}>
                            <h2 className="text-[16px] font-bold text-gray-900 mb-3 ml-1">
                                {month}
                            </h2>
                            <div className="space-y-4">
                                {courses.map(course => (
                                    <CourseCard
                                        key={course.id}
                                        {...course}
                                        onClick={() => onNavigateToCourse(course.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}