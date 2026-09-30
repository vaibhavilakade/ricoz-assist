package com.ricoz.assist.presentation.testutil;

import com.ricoz.assist.core.domain.Meeting;
import com.ricoz.assist.core.domain.User;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.UUID;

public class MeetingTestDataBuilder {

    public static Meeting.MeetingStatus defaultStatus = Meeting.MeetingStatus.SCHEDULED;

    public static Meeting aMeeting() {
        LocalDateTime now = LocalDateTime.now();
        Meeting meeting = Meeting.builder()
                .title("Test Meeting")
                .description("Test description")
                .scheduledStart(now.plusHours(1))
                .scheduledEnd(now.plusHours(2))
                .status(defaultStatus)
                .participants(new HashSet<>())
                .build();
        meeting.setId(UUID.randomUUID());
        meeting.setCreatedAt(now);
        meeting.setUpdatedAt(now);
        return meeting;
    }

    public static Meeting aMeetingWithOwner(User owner) {
        Meeting meeting = aMeeting();
        meeting.setOwner(owner);
        return meeting;
    }

    public static Meeting anInProgressMeeting() {
        Meeting meeting = aMeeting();
        meeting.setStatus(Meeting.MeetingStatus.IN_PROGRESS);
        meeting.setActualStart(LocalDateTime.now());
        return meeting;
    }

    public static Meeting aCompletedMeeting() {
        Meeting meeting = aMeeting();
        meeting.setStatus(Meeting.MeetingStatus.COMPLETED);
        meeting.setActualStart(LocalDateTime.now().minusHours(2));
        meeting.setActualEnd(LocalDateTime.now().minusHours(1));
        return meeting;
    }
}
