export type ClassesType = {
    name: string
    ancestors: string[]
}[]

export class Sneps { 
    classees: ClassesType

    // classes - массив объектов типа ClassType, содержащих два поля: название класса и его (непосредственные) родительские классы
    constructor(classes: ClassesType) {
        this.classees = classes
    }

    // Создает новый инстанс instancename класса classname
    instance(classname: string, instancename: string) {

    }

    // Проверяет, является ли поданная сущность instancename экземпляром или наследником класса classname
    isDescendant(instancename: string, classname: string): boolean {
        return true
    }
}


// Вариант использования

const sneps = new Sneps([
    {
        name: 'Животные',
        ancestors: [],
    },
    {
        name: 'Собаки',
        ancestors: ['Животные'],
    },
    {
        name: 'Овчарки',
        ancestors: ['Собаки'],
    },
    {
        name: 'Коты',
        ancestors: ['Животные'],
    },
    {
        name: 'Котопсы',
        ancestors: ['Коты', 'Собаки'],
    },
])

sneps.instance('Собаки', 'Шарик')

console.log(sneps.isDescendant('Шарик', 'Животные')) // true
console.log(sneps.isDescendant('Шарик', 'Собаки')) // true
console.log(sneps.isDescendant('Шарик', 'Коты')) // false

sneps.instance('Котопсы', 'Котопес')

console.log(sneps.isDescendant('Котопес', 'Животные')) // true
console.log(sneps.isDescendant('Котопес', 'Собаки')) // true
console.log(sneps.isDescendant('Котопес', 'Коты')) // true
console.log(sneps.isDescendant('Котопес', 'Котопсы')) // true

// Нужно реагировать на некорректные запросы
console.log(sneps.isDescendant('Не созданная сущность', 'Животные')) // false
