import { ColumnProps } from '@/store/types';

export function generateFitUrl(column: ColumnProps, width: number, height: number) {
    if (column.avatar) {
        column.avatar.fitUrl = column.avatar.url + `?x-oss-process=image/resize,m_pad,h_${height},w_${width}`;
    } else {
        column.avatar = {
            fitUrl: require('@/assets/logo.png'),
        };
    }
}

interface CheckCondition {
    format?: string[];
    size?: number;
}

type ErrorType = 'size' | 'format' | null;

export function beforeUploadCheck(file: File, condition: CheckCondition) {
    const { format, size } = condition;
    const isValidFormat = format ? format.includes(file.type) : true;
    const isValidSize = size ? file.size / 1024 / 1024 < size : true;
    let error: ErrorType = null;
    if (!isValidFormat) {
        error = 'format';
    }
    if (!isValidSize) {
        error = 'size';
    }
    return {
        passed: isValidFormat && isValidSize,
        error,
    };
}

interface TestProps {
    _id: string;
    name: string;
}

const testData: TestProps[] = [
    { _id: '1', name: 'a' },
    { _id: '2', name: 'b' },
];
interface TestObj {
    [key: string]: TestProps;
}
const testData2: TestObj = {
    '1': { _id: '1', name: 'a' },
    '2': { _id: '2', name: 'b' },
};
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
    return arr.reduce((prev, current) => {
        if (current._id) {
            prev[current._id] = current;
        }
        return prev;
    }, {} as { [key: string]: T });
};
const result = arrToObj(testData);
console.log(result);

export const objToArr = <T extends TestProps>(obj: { [key: string]: T }) => {
    return Object.keys(obj).map((key) => {
        return obj[key];
    });
};

const result2 = objToArr(testData2);
console.log(result2);
