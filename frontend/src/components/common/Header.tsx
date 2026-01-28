interface HeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

const Header = ({ left, center, right }: HeaderProps) => {
  return (
    <header className="relative flex items-center h-[56px] px-4 bg-white">
    
      <div className="flex items-center min-w-[40px]">
        {left}
      </div>

      
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        {center}
      </div>

   
      <div className="ml-auto flex items-center min-w-[40px] justify-end">
        {right}
      </div>
    </header>
  );
};

export default Header;
