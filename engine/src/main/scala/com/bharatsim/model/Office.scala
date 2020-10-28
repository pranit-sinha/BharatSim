package com.bharatsim.model

import com.bharatsim.engine.models.Network

case class Office(id: Int) extends Network {
  addRelation[Person]("EMPLOYER_OF")

  override def getContactProbability(): Double = 1
}
