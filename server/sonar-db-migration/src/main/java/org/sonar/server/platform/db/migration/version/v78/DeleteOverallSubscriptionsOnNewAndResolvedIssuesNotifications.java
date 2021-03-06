/*
 * SonarQube
 * Copyright (C) 2009-2019 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.server.platform.db.migration.version.v78;

import java.sql.SQLException;
import org.sonar.db.Database;
import org.sonar.server.platform.db.migration.SupportsBlueGreen;
import org.sonar.server.platform.db.migration.step.DataChange;
import org.sonar.server.platform.db.migration.step.MassUpdate;

@SupportsBlueGreen
public class DeleteOverallSubscriptionsOnNewAndResolvedIssuesNotifications extends DataChange {

  public DeleteOverallSubscriptionsOnNewAndResolvedIssuesNotifications(Database db) {
    super(db);
  }

  @Override
  public void execute(Context context) throws SQLException {
    MassUpdate massUpdate = context.prepareMassUpdate().rowPluralName("subscriptions");
    massUpdate.select("select id from properties " +
      "where resource_id is null " +
      "and (prop_key like 'notification.NewFalsePositiveIssue.%' or prop_key like 'notification.NewIssues.%')");
    massUpdate.update("delete from properties where id=?");
    massUpdate.execute((row, update) -> {
      long id = row.getLong(1);
      update.setLong(1, id);
      return true;
    });
  }

}
