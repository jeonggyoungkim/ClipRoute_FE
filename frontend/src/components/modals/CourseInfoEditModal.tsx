import { useState, useEffect, useRef } from "react";
import mappinIcon from "../../assets/icons/mappin-icon.svg";
import calendarIcon from "../../assets/icons/calendar-icon.svg";

interface CourseInfoEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newTitle: string, newDate: string) => void;
    initialTitle: string;
    initialDate: string;
}

export default function CourseInfoEditModal({
    isOpen,
    onClose,
    onSave,
    initialTitle,
    initialDate,
}: CourseInfoEditModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [date, setDate] = useState(initialDate);

    // 모달이 열릴 때마다 초기값 동기화
    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setDate(initialDate);
        }
    }, [isOpen, initialTitle, initialDate]);

    // 외부 클릭 처리를 위한 Ref
    const modalRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 저장하고 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onSave(title, date); // 현재 상태 저장
                onClose(); // 닫기
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, onSave, title, date]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-[12px] bg-black/0 pointer-events-none">
            {/* pointer-events-none으로 오버레이 클릭은 무시하되, 내부 컨텐츠는 auto로 설정하여 클릭 가능하게 함 */}
            {/* 하지만 외부 클릭 감지를 위해 전체 오버레이에 이벤트를 걸지 않고 document 이벤트를 사용했으므로, 
                여기서는 레이아웃만 잡아줌. 배경색은 투명. */}

            <div
                ref={modalRef}
                className="pointer-events-auto flex flex-col justify-center items-center gap-[0.625rem] w-[22.0625rem] px-[0.9375rem] py-[0.875rem] bg-white rounded-[0.9375rem] border border-[#42BCEB] shadow-sm animate-fade-in"
            >
                {/* 제목 입력 */}
                <div className="w-full flex items-center gap-[0.625rem]">
                    <img src={mappinIcon} alt="location" className="w-5 h-5 flex-shrink-0" />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 text-[15px] font-bold text-[#333] outline-none placeholder-gray-300 bg-transparent truncate"
                        placeholder="코스 제목"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSave(title, date);
                                onClose();
                            }
                        }}
                    />
                </div>

                {/* 구분선 */}
                <div className="w-full h-[1px] bg-[#EEEEEE]" />

                {/* 날짜 입력 */}
                <div className="w-full flex items-center gap-[0.625rem]">
                    <img src={calendarIcon} alt="calendar" className="w-5 h-5 flex-shrink-0" />
                    <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 text-[13px] font-medium text-[#333] outline-none placeholder-gray-300 bg-transparent truncate"
                        placeholder="YYYY.MM.DD - MM.DD"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSave(title, date);
                                onClose();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
