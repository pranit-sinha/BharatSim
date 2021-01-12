package com.bharatsim.model.diseaseState

import com.bharatsim.engine.Context
import com.bharatsim.engine.basicConversions.decoders.DefaultDecoders._
import com.bharatsim.engine.basicConversions.encoders.DefaultEncoders._
import com.bharatsim.engine.fsm.State
import com.bharatsim.engine.models.StatefulAgent
import com.bharatsim.engine.utils.Probability.biasedCoinToss
import com.bharatsim.model.InfectionSeverity.{Mild, Severe}
import com.bharatsim.model.InfectionStatus.{InfectedMild, InfectedSevere}
import com.bharatsim.model.{Disease, Person}

case class InfectedState[T](severity: T) extends State {

  override def enterAction(context: Context, agent: StatefulAgent): Unit = {
    if (severity == Mild) {
      agent.updateParam("infectionState", InfectedMild)
    } else if (severity == Severe) {
      agent.updateParam("infectionState", InfectedSevere)
    }
  }

  private def checkInfectionLastDay(context: Context, agent: StatefulAgent): Boolean = {
    agent.asInstanceOf[Person].infectionDay == context.dynamics
      .asInstanceOf[Disease.type]
      .lastDay
  }

  def checkForRecovery(context: Context, agent: StatefulAgent): Boolean = {
    if (checkInfectionLastDay(context, agent)) {
      return true
    }
    false
  }

  def checkForDeceased(context: Context, agent: StatefulAgent): Boolean = {
    if (agent.activeState == InfectedState(Severe) && checkInfectionLastDay(context, agent)) {
      if (biasedCoinToss(context.dynamics.asInstanceOf[Disease.type].deathRate)) {
        return true
      }
    }
    false
  }

  addTransition(
    when = checkForDeceased,
    to = context => DeceasedState()
  )

  addTransition(
    when = checkForRecovery,
    to = context => RecoveredState()
  )
}