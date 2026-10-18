import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MedicalService } from './medical.service';
import type {
  MedicationSchedule,
  PatientProfile,
  CaregiverAlert,
  CreateMedicationScheduleDto,
} from '@internal/contracts';

@ApiTags('Medical')
@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @Get('patients/:patientId/schedules')
  @ApiOperation({ summary: "Get patient's medication schedule for today" })
  @ApiParam({ name: 'patientId', description: 'Unique patient identifier (e.g. pt_101)' })
  @ApiResponse({ status: 200, description: 'List of active medication reminders' })
  async getTodaySchedules(@Param('patientId') patientId: string): Promise<MedicationSchedule[]> {
    return this.medicalService.getTodaySchedules(patientId);
  }

  @Post('patients/:patientId/reminders/:reminderId/taken')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acknowledge dose taken by patient (1-tap action)' })
  @ApiParam({ name: 'patientId', description: 'Patient UID' })
  @ApiParam({ name: 'reminderId', description: 'Reminder Schedule ID' })
  @ApiResponse({ status: 200, description: 'Dose marked as taken successfully' })
  async markAsTaken(
    @Param('patientId') patientId: string,
    @Param('reminderId') reminderId: string,
  ): Promise<{ success: boolean }> {
    await this.medicalService.markAsTaken(patientId, reminderId);
    return { success: true };
  }

  @Post('patients/:patientId/reminders')
  @ApiOperation({ summary: 'Add a new prescription medication schedule (Caregiver action)' })
  @ApiParam({ name: 'patientId', description: 'Patient UID' })
  @ApiResponse({ status: 201, description: 'Schedule created with new ID' })
  async createReminder(
    @Param('patientId') patientId: string,
    @Body() reminderDto: CreateMedicationScheduleDto,
  ): Promise<{ id: string }> {
    const id = await this.medicalService.createReminder(patientId, reminderDto);
    return { id };
  }

  @Delete('patients/:patientId/reminders/:reminderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate / remove a medication reminder' })
  async deleteReminder(
    @Param('patientId') patientId: string,
    @Param('reminderId') reminderId: string,
  ): Promise<void> {
    await this.medicalService.deleteReminder(patientId, reminderId);
  }

  @Get('patients/:patientId')
  @ApiOperation({ summary: 'Retrieve patient profile, emergency contact, and accessibility settings' })
  async getPatientProfile(@Param('patientId') patientId: string): Promise<PatientProfile> {
    return this.medicalService.getPatientProfile(patientId);
  }

  @Get('caregivers/:caregiverUid/alerts')
  @ApiOperation({ summary: 'Get urgent alerts for caregiver (missed doses, SOS triggers)' })
  async getCaregiverAlerts(@Param('caregiverUid') caregiverUid: string): Promise<CaregiverAlert[]> {
    return this.medicalService.getCaregiverAlerts(caregiverUid);
  }

  @Post('caregivers/alerts/:alertId/ack')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acknowledge/dismiss caregiver alert' })
  async acknowledgeAlert(@Param('alertId') alertId: string): Promise<{ success: boolean }> {
    await this.medicalService.acknowledgeAlert(alertId);
    return { success: true };
  }

  @Post('pairing')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pair patient with caregiver using Login ID and 4-digit PIN' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patientLoginId: { type: 'string', example: 'AAJI101' },
        pin: { type: 'string', example: '1234' },
        caregiverUid: { type: 'string', example: 'cg_202' },
      },
      required: ['patientLoginId', 'pin', 'caregiverUid'],
    },
  })
  async pairPatient(
    @Body() body: { patientLoginId: string; pin: string; caregiverUid: string },
  ): Promise<{ success: boolean; patientId: string }> {
    return this.medicalService.pairPatientWithCaregiver(
      body.patientLoginId,
      body.pin,
      body.caregiverUid,
    );
  }
}
