import { ClassType, Sneps } from '@/libs/classCreator'
import { useCallback, useState } from 'react'

export interface EntitiesProps {
    classes: ClassType
    setClasses: (classes: ClassType | ((cl: ClassType) => ClassType)) => void
    disabled: boolean
}

const selectBaseClass = 'Выберите базовый класс'

export const Entities = (props: EntitiesProps) => {
    const { classes, setClasses, disabled } = props
    const [newClassName, setnewClassName] = useState("");

    const addEntity = useCallback((e: any) => {
        e.preventDefault()
        if (!newClassName || classes.map(c => c.name).includes(newClassName)) {
            return
        }
        const newClass: ClassType[number] = {
            name: newClassName as string,
            ancestors: [],
        }
        setClasses(classes => [...classes, newClass])
        setnewClassName("")
    }, [setClasses, newClassName, classes])

    const addAncesor = useCallback((inputSelector: string, childName: string) => {
        return (e: any) => {
            e.preventDefault()
            const element = document.querySelector(inputSelector) as null | HTMLSelectElement
            if (!element) {
                return
            }
            const name = element.value
            if (name == selectBaseClass) {
                return
            }
            setClasses(classes => [...classes].map(cl => {
                if (cl.name === childName && !cl.ancestors.includes(name)) {
                    cl.ancestors.push(name)
                }
                return cl
            }) )
        }
    }, [setClasses])

    return (
        <div style={{ textAlign: 'unset' }}>
            <ul>
                { classes.map(cl => (
                    <li key={cl.name}>
                        <span>{cl.name}</span>
                        <h5 style={{ margin: 2 }}>{ cl.ancestors.length ? 'Наследуется от:' : 'Базовые классы не заданы'}</h5>
                        { cl.ancestors.length && <ul>
                            { cl.ancestors.map(ancestor => (
                                <li key={ancestor}><span>{ancestor}</span></li>
                            ))}
                        </ul> || null}
                        {!disabled && <form>
                            <select name='name' title='Введите название класса' id={'ancestor-input-for-' + cl.name} defaultValue={selectBaseClass}>
                                <option disabled>{selectBaseClass}</option>
                                <option disabled>Создайте новые классы, чтобы расширить здесь выбор</option>
                                { classes.map(ancestor => (
                                    Sneps.isDescendant(cl.name, ancestor.name, classes) ? null : <option key={ancestor.name}>{ancestor.name}</option>
                                )) }
                            </select>
                            <button onClick={addAncesor('#ancestor-input-for-' + cl.name, cl.name)}>Добавить новый базовый класс</button>
                        </form> || null}
                    </li>
                )) }
            </ul>
            <br/>
            {!disabled && <form>
                <input autoFocus name='name' placeholder='Греки' title='Введите название класса' onChange={e => setnewClassName(e.target.value)} value={newClassName}/>
                <button onClick={addEntity}>Добавить новый класс</button>
            </form> || null}
        </div>
    )
}
