import React from 'react'
import { RoadMap } from '@/app/types/user'
import { AnimatePresence, motion } from 'framer-motion'
import Card from './card'

const RoadMapList = ({filteredRoadmaps}: {filteredRoadmaps: RoadMap[]}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
            {filteredRoadmaps.map((roadmap, idx) => (
                <motion.div
                    key={roadmap.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                >
                    <Card roadmap={roadmap} />
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
  )
}

export default RoadMapList