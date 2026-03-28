import React from 'react'

const PageNavbar = ({ title, bio} : { title: string, bio: string }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-extrabold">{title}</h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    {bio}
                </p>
            </div>
        </div>
    </div>
  )
}

export default PageNavbar