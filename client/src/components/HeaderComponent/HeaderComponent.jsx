import { ChefHat } from 'lucide-react';
function HeaderComponent() {
    return(
        <>
        <header className='flex flex-wrap p-4 justify-center bg-orange-600 gap-2 font-bold text-white shadow-lg'>
                <ChefHat color='white'size={36}/>
                <h3 className='text-2xl'>Instant Falvora</h3>
        </header>
        </>
    )
}

export default HeaderComponent