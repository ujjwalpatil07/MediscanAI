import { FaClinicMedical } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Logo() {
    return (
        <Link to={"/"} className="flex items-center w-fit">
            <FaClinicMedical className="text-green-600 dark:text-green-400 text-2xl mr-2 mb-1" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">MediScan</p>
        </Link>
    )
}