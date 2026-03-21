import React from 'react'

{/*
    Тут каждый Subject -> предмет, который может хранить n колличество уроков, к примеру дискретная математика, а внутри типа векторы, матрицы, графы и все.
    Есть еще страницами Exercise в которой можно будет вариант примера типа просто решение рандомного примера, рандомный вопрос, Quiz.
    там можно будет выбрать Subject и диапазон материала от 1 - n колличества уроков внутри предмета.
    Можно еще будет выбирать сложность, но это спорная вещь. для все го еще можно будет выбирать n колл subject с k колл уроков.
    
    mafs.dev -> мини Geogebra
    Возможность включить математический режим который автоматически будет импортировать все в правильный стиль типа 3/4 будет превращаться в дробь.
    4 2/3 -> в дробь и так далее. 
*/}

const page = () => {
  return (
    <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto py-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight">Learning Roadmaps</h1>
                <p className="text-muted-foreground text-lg">Comprehensive guides to help you choose your path in tech.</p>
            </div>
        </div>
    </div>
  )
}

export default page