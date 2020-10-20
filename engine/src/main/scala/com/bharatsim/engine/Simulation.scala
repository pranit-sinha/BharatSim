package com.bharatsim.engine

import com.bharatsim.engine.listners.SimulationListenerRegistry
import com.bharatsim.engine.models.Agent
import com.typesafe.scalalogging.LazyLogging

class Simulation extends LazyLogging {
  def run(context: Context): Unit = {
    SimulationListenerRegistry.notifySimulationStart(context)
    for (step <- 1 to context.simulationContext.simulationSteps) {
      logger.info("Tick {}", step)
      context.simulationContext.setCurrentStep(step)
      SimulationListenerRegistry.notifyStepStart(context)

      val agentTypes = context.fetchAgentTypes

      agentTypes.foreach(agentType => {
        agentType(context.graphProvider).foreach((agent: Agent) => {
          agent.behaviours.foreach(b => b(context))
        })
      })

      SimulationListenerRegistry.notifyStepEnd(context)
    }
    SimulationListenerRegistry.notifySimulationEnd(context)
  }
}

object Simulation {
  def run()(implicit context: Context): Unit = {
    val simulation = new Simulation()
    simulation.run(context)
  }
}
